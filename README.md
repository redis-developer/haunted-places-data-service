# Haunted Places Data Service: Using Node.js, Apollo GraphQL, and Redis

This is a simple data service that use Apollo GraphQL to expose data on Redis. This README will get you up and running quickly with it.

## What You'll Need

- **Docker**: We'll use this to run Redis with the correct Redis modules loaded.
- **Node 15.8 or better**: As long is it supports ES Modules, you should be good.

## Cloning this Repo

WARNING! THIS REPOSITORY USES SUBMODULES!

So, you'll want to make sure you clone it with the correct command:

    $ git clone --recurse-submodules git@github.com:redis-developer/haunted-places-data-service.git

Also, this repository supports some upcoming videos (links pending) and has a branch for each. This version of the document is for the `part-1-graphql-and-redis` branch. So, if something looks weird when you're comparing code, just keep calm and:

    $ git checkout part-1-graphql-and-redis

## Start Redis

From the root directory, change into the `docker` directory and launch Redis with `docker compose up`:

    $ cd docker

    $ docker compose up

You should see the following (truncated) response:

    [+] Running 1/0
     ⠿ Container docker_redis_1  Recreated    0.0s
    Attaching to redis_1
    redis_1  | 1:C 27 Apr 2021 21:54:34.767 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
    redis_1  | 1:C 27 Apr 2021 21:54:34.767 # Redis version=6.0.1, bits=64, commit=00000000, modified=0, pid=1, just started
    redis_1  | 1:C 27 Apr 2021 21:54:34.767 # Configuration loaded
    redis_1  | 1:M 27 Apr 2021 21:54:34.770 * Running mode=standalone, port=6379.
    redis_1  | 1:M 27 Apr 2021 21:54:34.770 # Server initialized
    ...

If you don't have a `docker` directory, make sure you cloned the repository using the `--recurse-submodules` submodules flag.

## Load the Haunted Places

Now, *From a new terminal*, load the data into Redis with the following command:

    $ npm run load

This should run for a couple seconds without much fanfare. But, you now have about 10,000 haunted places loaded into Redis. Hooray!

If you instead see the following error:

    [ioredis] Unhandled error event: Error: connect ECONNREFUSED 127.0.0.1:6379
        at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1137:16)

This means that Node.js can't see Redis. You may not have it running.

NOTE: The load script only knows to load to a Redis instance running locally. If you want to load to a different instance, I leave it as an exercise for the reader to change `src/load.js` to look there.

## Run the Server

Redis is running. The data is loaded. Nothing else left to do but run the server:

    $ npm start

And you should see the following response:

    > haunted-places-data-service@1.0.0 start
    > node src/app.js

    👻 Server ready at http://localhost:80/ 👻

Point your browser to http://localhost/ and start messing with the server.
