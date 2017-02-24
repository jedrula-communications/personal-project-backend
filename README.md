# personal-project-backend
this is a backend api (JSON API) for personal project

#### to download the code and spin the server

1. copy contents of https://github.com/jedrula-communications/personal-project-backend/blob/master/bin/build to a file on the server like build_personal-project-backend

2. sh build_personal-project-backend

3. cd personal-project-backend-master

4. spin it
```
node index.js
```

4.1. ... as a service
```
sudo forever-service install personal-project-backend-master --script index.js
sudo service personal-project-backend start
```

[more on that here](http://jedrula-app.surge.sh/post/e58f4fd4-bda4-4a1d-801b-d68cc255a63f)

