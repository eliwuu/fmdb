#! /bib/bash

if [ ! -f .env ]; then
    cp .env.model .env
fi

docker compose --env-file .env up -d