import os
from contextlib import contextmanager

import psycopg2
from dotenv import load_dotenv
from psycopg2 import pool

from DuRAG.logger import logger

load_dotenv()


class Database:
    def __init__(self):
        self.connection_pool = pool.SimpleConnectionPool(
            minconn=1,
            maxconn=10,
            host=os.getenv("DB_HOST"),
            database=os.getenv("DEV_DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            port=os.getenv("DB_PORT"),
        )

    @contextmanager
    def get_cursor(self):
        con = self.connection_pool.getconn()
        try:
            yield con.cursor()
            con.commit()
        except psycopg2.DatabaseError as e:
            logger.error(f"Database error: {e}")
            con.rollback()
        finally:
            logger.info("Closing RDS connection")
            con.close()
            self.connection_pool.putconn(con)
            logger.info("Closed RDS connection sucessfully")


db = Database()