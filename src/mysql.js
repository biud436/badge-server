const mysql = require("mysql2");
const path = require("path");
const fs = require("fs");
const settings = require("../config.json");

class SQLManagerImpl {

    constructor() {
    }

    createConnection() {
        return new Promise((resolve, reject) => {
            const pool = mysql.createPool({
                connectionLimit: 10,
                host: settings.host,
                port: settings.port,
                user: settings.user,
                password: settings.password,
                database: settings.database,
                debug: false
            });

            pool.getConnection((err, conn) => {
                if(err) {
                    
                    if(conn) {
                        conn.release();
                    }

                    reject(err);
                    return;
                }
                resolve(conn);
            });
        });
    }

    async getConnection() {
        this._conn = await this.createConnection();
        return this._conn;
    }

    async dropTable() {
        this._conn = await this.createConnection();
        this._conn.query(`DROP TABLE if EXISTS tblShortUrl`, (err, result) => {
            if(err) {
                console.warn(err);
                conn.release();
                return;
            }
            console.log("drop table 성공");
        })    

        return this._conn;
    }

    async createTable(conn) {
        
        conn.query(`create table tblShortUrl( urlKey varchar(200) not NULL  PRIMARY KEY NOT NULL, urlValue varchar(255) NOT NULL )`, (err, result) => {
            if(err) {
                console.warn(err);
                conn.release();
                return;
            }
            console.log("테이블 생성 완료");
        });

        return conn;
    }

    async insertData(conn, myUrl) {
        try {

            const url = decodeURIComponent( myUrl );

            const query = `INSERT INTO tblShortUrl(urlKey, urlValue) VALUES( LEFT(MD5(?), 6), ? )`;
            const exec = conn.query(query, [
                url,
                url
            ], (err, result) => {
                conn.release();
            });

        } catch(e) {
            console.warn(e);
        }

        return conn;
    }

    async getData(conn, key) {
        return new Promise((resolve, reject) => {
            try {
                const query = `SELECT urlValue FROM tblShortUrl WHERE urlKey = ?`;
                const exec = conn.query(query, [
                    key
                ], (err, result) => {
                    conn.release();

                    if(err) {
                        reject(err);
                        return;
                    }

                    if(result.length > 0) {
                        resolve(result);
                    } else {
                        reject("데이터를 찾을 수 없습니다.");
                    }

                });
    
            } catch(e) {
                console.warn(e);
            }
        })

    }
    
    async getKey(conn, url) {
        return new Promise((resolve, reject) => {
            try {
                const query = `SELECT urlKey FROM tblShortUrl WHERE urlValue = ?`;
                const exec = conn.query(query, [
                    url
                ], (err, result) => {
                    conn.release();

                    if(err) {
                        reject(err);
                        return;
                    }

                    if(result.length > 0) {
                        resolve(result);
                    } else {
                        reject("데이터를 찾을 수 없습니다.");
                    }

                });
    
            } catch(e) {
                console.warn(e);
            }
        })

    }
}

class ShortUrl {
    async insert(url, callback) {
        try {
            const man = new SQLManagerImpl();
    
            man.getConnection().then(async (conn) => {
                await man.insertData(conn, url);
                callback();
            }).catch(err => console.warn(err));
            
        } catch(e) {
            console.warn(e);
        }        
    }    

    async get(key, callback) {
        const man = new SQLManagerImpl();
        man.getConnection().then(async (conn) => {
            man.getData(conn, key).then(result => {
                callback(false, result)
            }).catch(err => {
                callback(true, result);
            });
        }).catch(err => {
            console.warn(err);
        });
    }
    
    async getKey(url, callback) {
        const man = new SQLManagerImpl();
        man.getConnection().then(async (conn) => {
            man.getKey(conn, url).then(result => {
                callback(false, result)
            }).catch(err => {
                callback(true, result);
            });
        }).catch(err => {
            console.warn(err);
        });
    }
}

module.exports = ShortUrl;