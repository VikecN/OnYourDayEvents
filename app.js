const express = require("express");
const axios = require('axios');

const PORT = 8081;

const users = [
    {username: "vikec", password: "vik12", fullName: "Viktor Nedanovski", dob: "01-04-2001"},
    {username: "acka", password: "acka12", fullName: "Aleksandar Bogdanovski", dob: "06-07-1998"},
    {username: "stojko", password: "stojko12", fullName: "Stojko Stojkovski", dob: "16-05-1933"}
]

const failedLogin = "Incorrect username or password, try again!";

const app = express();
app.use(express.json());
app.set("view engine", "ejs")

app.get("/", (req, res) => res.render('index'))

app.post("/login", async (req, res) => {
    const {username, password} = req.body;

    let user = users.find(f => f.username === username && f.password === password);

    if(user == null){
        res.status(401)
        return res.json({message: failedLogin});
    }

    const parseDOB = new Date(user.dob);
    const day = parseDOB.getDate();
    const month = parseDOB.getMonth() + 1;
    const year = parseDOB.getFullYear();
    const API_URL = "http://history.muffinlabs.com/date/";

    const apiResponse = await axios.get(`${API_URL}/${day}/${month}`);

    const sameYearBirths = apiResponse.data.data.Births.filter(f => f.year == year);
    const sameYearDeaths = apiResponse.data.data.Deaths.filter(f => f.year == year);
    const sameYearEvents = apiResponse.data.data.Events.filter(f => f.year == year);

    const filteredData = {
        data: {
            Births: sameYearBirths,
            Deaths: sameYearDeaths,
            Events: sameYearEvents
        }
    }
    res.status(201);
    return res.json({"user": user, "dateInfo": filteredData});
});

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));