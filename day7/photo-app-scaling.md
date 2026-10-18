# SnapShare: Photo App Scaling Plan

## 1. Assumptions

SnapShare is a photo-sharing application where users upload photos and view a feed containing photos from people they follow.

The following assumptions are used for this scaling plan:

- Registered users: 10 million.
- 10% of registered users are active daily.
- Each daily active user uploads one photo per day.
- Each daily active user views 50 feed pages per day.
- Each original photo has an average size of 2 MB.
- Each photo has one thumbnail of 50 KB.
- There are 86,400 seconds in a day and 365 days in a year.
- Traffic is spread across the day for average calculations, while peak traffic is estimated at five times the average.
- Storage calculations use decimal units: 1 TB = 1,000,000 MB.
- Every uploaded photo is retained for one year, with no deletions.
- The estimates exclude storage replication, backups, and additional application data.

### Daily active users

Daily active users (DAU) are 10% of registered users.

DAU = 10,000,000 × 0.10

**DAU = 1,000,000 users**

## 2. Traffic and storage calculations

### Uploads per second

Daily uploads = 1,000,000 users × 1 photo

Daily uploads = 1,000,000 photos.

Average uploads per second:

1,000,000 ÷ 86,400 = 11.57 uploads per second.

**Average upload rate: approximately 12 uploads per second.**

### Feed views per second

Daily feed views = 1,000,000 users × 50 pages

Daily feed views = 50,000,000 pages.

Average feed views per second:

50,000,000 ÷ 86,400 = 578.70 views per second.

Peak feed views per second:

578.70 × 5 = 2,893.52 views per second.

**Average feed rate: approximately 579 views per second.**

**Estimated peak feed rate: approximately 2,894 views per second.**

These figures estimate feed page requests, not the number of individual photos delivered.

### Photo storage per year

Original photo storage:

- 1,000,000 photos per day × 365 days = 365,000,000 photos per year.
- 365,000,000 × 2 MB = 730,000,000 MB.
- Original photo storage = **730 TB per year**.

Thumbnail storage:

- 365,000,000 × 50 KB = 18,250,000,000 KB.
- Thumbnail storage = **18.25 TB per year**.

Total photo storage:

730 TB + 18.25 TB = **748.25 TB per year**.

This estimate includes original photos and thumbnails but excludes backups, replication, and other storage overhead.

## 3. Read-heavy or write-heavy?

SnapShare is a **read-heavy system** because users view 50 million feed pages per day but upload only 1 million photos per day.

Feed views are 50 times more frequent than photo uploads.

This means the architecture should prioritize fast feed loading, caching frequently requested data, using a database read replica for read traffic, and delivering photos through a Content Delivery Network (CDN).

## 4. Why photos should not be stored inside the database

Original photos and thumbnails should be stored in object storage rather than directly inside the database.

Storing large image files in a database would increase database size, make backups and recovery more expensive, and compete with feed queries and other database operations for resources.

Object storage is designed to store large files efficiently and can scale independently of the database.

The database should store photo metadata, such as the photo ID, owner ID, caption, upload timestamp, and object storage key or URL. This keeps the database focused on structured information while the CDN delivers the actual image files.

## 5. Architecture diagram

```text
                    +------------------+
                    |       Users      |
                    +--------+---------+
                             |
                             v
                    +------------------+
                    |       CDN        |
                    | Cached images    |
                    +--------+---------+
                             |
                             v
                    +------------------+
                    |  Load Balancer   |
                    +--------+---------+
                             |
                 +-----------+-----------+
                 |           |           |
                 v           v           v
             +--------+  +--------+  +--------+
             |  App 1 |  |  App 2 |  |  App N |
             +---+----+  +---+----+  +---+----+
                 |           |           |
                 +-----------+-----------+
                             |
                  +----------+----------+
                  |                     |
                  v                     v
          +---------------+     +---------------+
          | Cache         |     | Primary       |
          | Feed and      |     | Database      |
          | metadata      |     +-------+-------+
          +---------------+             |
                                        v
                                +---------------+
                                | Read Replica  |
                                +---------------+

             PHOTO UPLOAD AND THUMBNAIL PROCESSING

                    +------------------+
                    |    App Server    |
                    +--------+---------+
                             |
                 +-----------+-----------+
                 |                       |
                 v                       v
        +----------------+       +----------------+
        | Object Storage |       | Message Queue  |
        | Original photo|       | Thumbnail job  |
        +-------+--------+       +--------+-------+
                 ^                         |
                 |                         v
                 |                +----------------+
                 |                | Thumbnail      |
                 +----------------| Worker         |
                                  +--------+-------+
                                           |
                                           v
                                  +----------------+
                                  | Object Storage |
                                  | Thumbnail      |
                                  +----------------+
```

The CDN serves cached images directly to users when possible. The load balancer distributes application requests across multiple app servers. The app servers handle application logic, while the cache and database support feed and metadata requests.

During uploads, the original photo is stored in object storage and a thumbnail job is added to a queue for background processing.

## 6. Components and the problems they solve

1. **CDN:** Delivers cached photos and thumbnails from locations closer to users, reducing latency and application-server bandwidth.
2. **Load balancer:** Distributes incoming requests across app servers to prevent a single server from becoming overloaded.
3. **App servers:** Handle user requests, authentication, upload coordination, feed generation, and business logic.
4. **Cache:** Keeps frequently accessed feed data and metadata in fast memory to reduce repeated database queries.
5. **Primary database:** Stores structured information such as users, follows, photo metadata, captions, and feed relationships.
6. **Database read replica:** Handles suitable read queries so the primary database can focus on writes.
7. **Object storage:** Stores original photos and thumbnails separately from the database and scales to large amounts of image data.
8. **Message queue:** Holds thumbnail-processing jobs so uploads do not need to wait for image processing to finish.
9. **Thumbnail worker:** Processes queued jobs in the background, creates smaller versions of images, and saves the thumbnails to object storage.

## 7. Step-by-step photo upload flow

1. The user selects a photo and submits it through the application.
2. The load balancer forwards the upload request to an available app server.
3. The app server authenticates the user and validates the file type, file size, and upload permissions.
4. The original photo is uploaded to object storage, where it receives a unique storage key.
5. The app server saves the photo metadata and storage key in the primary database.
6. The app server publishes a thumbnail-generation job to the message queue.
7. The app server confirms that the upload has been accepted without waiting for thumbnail processing to finish.
8. A thumbnail worker retrieves the job from the queue and downloads or reads the original photo from object storage.
9. The worker generates a 50 KB thumbnail and uploads it to object storage.
10. The worker updates the photo metadata or processing status if needed, and the thumbnail becomes available for use.
11. The application can display the original photo or thumbnail using its CDN URL, depending on the request.
12. The CDN caches the image when appropriate and serves subsequent requests more efficiently.

The queue allows thumbnail processing to happen asynchronously, so a slow thumbnail job does not have to delay the user's upload confirmation.

## 8. Trade-offs

### Trade-off 1: Caching versus data freshness

Caching improves performance and reduces database load, but cached feed data may become outdated when someone uploads a new photo or follows another user.

The application must balance fast responses with cache invalidation or short cache expiration times.

### Trade-off 2: Asynchronous thumbnails versus immediate availability

Using a queue and background worker improves upload responsiveness and allows thumbnail processing to scale independently.

However, a thumbnail may not be available immediately after an upload, and failed jobs must be retried or monitored.

### Trade-off 3: Read replicas versus consistency

A read replica can handle feed and metadata reads, reducing the workload on the primary database.

However, replication can lag behind the primary database, so users might temporarily see stale information. Important operations that require the latest data may need to read from the primary database.

### Trade-off 4: CDN caching versus storage and invalidation complexity

A CDN reduces image delivery latency and bandwidth costs at the application servers.

However, cached images may remain available after an image is updated or deleted unless cache invalidation and access-control rules are handled correctly.

## 9. Conclusion

SnapShare should use a distributed architecture that separates image storage, application processing, and structured metadata.

With 1 million daily active users, approximately 579 average feed views per second, an estimated peak of 2,894 feed views per second, and approximately 748.25 TB of new image data per year, the system needs scalable object storage, a CDN, caching, multiple app servers, a database read replica, and asynchronous thumbnail processing.

The design prioritizes read performance while allowing photo uploads and thumbnail generation to scale independently.
