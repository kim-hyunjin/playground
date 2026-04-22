# PostgreSQL Cursor Demonstration

This project demonstrates the differences between **Client-Side Cursors** and **Server-Side Cursors** in PostgreSQL using the `psycopg2` library.

## Project Overview

In database programming, a cursor is a control structure that enables traversal over the records in a database. `psycopg2` supports two types of cursors:

1.  **Client-Side Cursor (Default)**: Fetches all results from the server to the client's memory immediately upon execution.
2.  **Server-Side Cursor (Named)**: Keeps the result set on the server and fetches rows as needed, reducing client-side memory usage.

## Prerequisites

- Python 3.12+
- PostgreSQL database
- `psycopg2` or `psycopg2-binary` library

## Setup

### 1. Database Table
Ensure you have a table named `employees` in your PostgreSQL database:

```sql
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);
```

### 2. Configuration
The scripts use the following connection parameters by default. Update them in `insert1m.py`, `clientcur.py`, and `servercur.py` as needed:

```python
con = psycopg2.connect(
    host="hyunjin",
    database="test",
    user="postgres",
    password="postgres"
)
```

### 3. Insert Test Data
Run the following script to insert 1,000,000 rows into the `employees` table:

```bash
python insert1m.py
```

## Running the Demos

### Client-Side Cursor
Run `clientcur.py` to see the performance of a default client-side cursor:

```bash
python clientcur.py
```
- **Observation**: The `execute()` call takes longer because it fetches all data, but subsequent `fetchmany()` calls are extremely fast as the data is already in local memory.

### Server-Side Cursor
Run `servercur.py` to see the performance of a named server-side cursor:

```bash
python servercur.py
```
- **Observation**: The `execute()` call is fast because it doesn't fetch data yet. However, `fetchmany()` calls take longer because they require a network round-trip to the server for each batch.

## Comparison Summary

| Feature | Client-Side Cursor | Server-Side Cursor |
| :--- | :--- | :--- |
| **Memory Usage** | High (Client) | Low (Client) |
| **Initial Latency** | High (Fetches all data) | Low (Query only) |
| **Fetching Speed** | Fast (Local memory) | Slower (Network round-trip) |
| **Best For** | Small to medium datasets | Very large datasets (memory efficiency) |
