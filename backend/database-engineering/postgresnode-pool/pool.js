const app = require("express")();
const {Pool} = require("pg");


const pool = new Pool({
    "host": "husseinmac.local",
    "port": 5432,
    "user":"postgres",
    "password" : "postgres",
    "database" : "husseindb",
    "max": 20,
    "connectionTimeoutMillis" : 0, // 모든 커넥션이 사용중이면 계속 기다림
    "idleTimeoutMillis": 0 // 커넥션이 유휴 상태로 유지되는 최대 시간
})

app.get("/employees", async (req, res) => {
    const fromDate = new Date();

    //return all rows
    const results = await pool.query("select employeeid eid,firstname,ssn from employees")
    console.table(results.rows)
    console.log(new Date())
    const toDate = new Date();
    const elapsed = toDate.getTime() - fromDate.getTime();

    //send it to the wire
    res.send({"rows": results.rows, "elapsed": elapsed, "method": "pool"})
})

app.listen(2015, () => console.log("Listening on port 2015"))
