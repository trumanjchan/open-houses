# Open Houses

Open Houses was built for realtors to share a list of properties their client may like to tour in a day, by simply sending a link.

On the site a user can search for property with filters such as only show properties with upcoming open house dates. Users can create an account and sign in to save properties to a list, and share each list as a link. A user can organize their lists by day and open house times, effectively creating a scheduling list for back-to-back tours.

## App Workflow

[Watch Demo Video](https://youtu.be/3FRwNxaDOxM?si=h2Hrg4XtLG4vLo_x)

---

<details>

<summary>Local Development</summary>

### Run locally

Node v24+
```
git clone https://github.com/trumanjchan/open-houses.git
npm install
npm start
```

Your `.env` file should have variables:
```
REALTY_API_KEY

DB_HOST
DB_PORT
DB_USERNAME
DB_PASSWORD
DB_DATABASE
```

Navigate to `http://localhost:3000/`

</details>