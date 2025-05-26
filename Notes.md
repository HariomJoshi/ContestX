## Getting started with redis

- To run redis in detatched mode
  `docker run --name contestX-queue -d -p 6379:6379 redis`
- To go inside a container
  `docker exec -it container_id /bin/bash`
- To run CLI
  `redis-cli`

### Redis as Datastore (Hashing)

- Common operations
  - SET
  - GET
  - HSET
  - HGET

### Redis as a queue

- Push from one process and pop from another processes
- Common Operations
  - LPUSH
  - LPOP
  - RPUSH
  - RPOP
  - BLPUSH (Blocking Push)
  - BLPOP (Blocking Pop)
  - BRPUSH
  - BRPOP (wait for the given time (or infinitely), untill someone pushes to the queue)
