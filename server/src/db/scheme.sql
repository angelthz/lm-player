-- MARK: SONGS SCHEME
CREATE TABLE artist(
	id integer PRIMARY KEY,
  	name varchar UNIQUE,
  	bio varchar,
	x64 varchar,
    x128 varchar,
    x256 varchar,
    x512 varchar,
    x1200 varchar,
  	x1800 varchar,
   is_favorite DEFAULT FALSE,
   created_at date
);

CREATE TABLE album(
    id integer PRIMARY KEY,
    name varchar,
    release_year integer,
    x64 varchar,
    x128 varchar,
    x256 varchar,
    x512 varchar,
    x1200 varchar,
    artist_id integer,
    is_favorite DEFAULT FALSE,
    created_at date,
  	FOREIGN key (artist_id) REFERENCES artist(id)
);

CREATE TABLE genre(
	id integer PRIMARY KEY,
  	name varchar UNIQUE
);

CREATE TABLE song(
	id integer PRIMARY KEY,
  	title varchar,
  	duration integer,
 	track_num integer,
  	has_collab bolean,
  	plain_lyrics integer,
  	sync_lyrics integer,
	path varchar,
	file_name varchar,
  	album_id integer,
	play_count integer DEFAULT 0,
       is_favorite DEFAULT FALSE,
  	created_at date,
  	FOREIGN key (album_id) REFERENCES album(id)
);

create table collaborations(
	main_id integer,
	collaborator_id integer,
  	song_id integer,
  	FOREIGN KEY (main_id) REFERENCES artist(id),
	FOREIGN KEY (collaborator_id) REFERENCES artist(id),
  	FOREIGN KEY (song_id) REFERENCES song(id)
);

CREATE TABLE song_genres(
	song_id integer,
	genre_id integer,
	FOREIGN KEY (song_id) REFERENCES song(id),
	FOREIGN KEY (genre_id) REFERENCES genre(id)
);

CREATE TABLE playlist(
	id integer PRIMARY key AUTOINCREMENT,
  	name varchar,
	created_at date
);


CREATE TABLE playlist_songs(
	song_id integer,
  	playlist_id integer,
	added_at date,
	FOREIGN KEY (song_id) REFERENCES song(id),
	FOREIGN KEY (playlist_id) REFERENCES playlist(id)	
);


CREATE TABLE song_activity(
    id INTEGER PRIMARY KEY autoincrement,
    play_date DATE,
    song_id INTEGER,
    FOREIGN KEY (song_id) REFERENCES song(id)
);
-- SONGS --


-- MARK: USER SCHEME
CREATE TABLE user(
	id varchar PRIMARY KEY,
  	name varchar UNIQUE,
	pass varchar,
	created_at date
);


-- MARK: TRIGGERS
CREATE TRIGGER on_insert_song_log_update_song_play_count
AFTER INSERT on song_activity
BEGIN
	UPDATE song set play_count = play_count + 1 WHERE id = new.song_id;
END;



-- MARK: SONG DETAILS

DROP VIEW IF EXISTS view_song_details;

CREATE VIEW view_song_details AS
WITH
    collab_by_song AS (
        SELECT co.song_id, json_group_array(
                json_object('id', car.id, 'name', car.name)
            ) AS collaborators
        FROM collaborations co
            INNER JOIN artist AS mar ON mar.id = co.main_id
            INNER JOIN artist as car ON car.id = co.collaborator_id
        GROUP BY
            co.song_id
    )
SELECT
    so.id AS song_id,
    so.title AS song_title,
    al.id AS album_id,
    al.name AS album_name,
    ar.id AS artist_id,
    ar.name AS artist_name,
    so.track_num AS track_num,
    al.release_year as release_year,
    json_object(
        'seconds', so.duration,
        'minutes', so.duration/60,
        'hours', so.duration/3600
    ) as duration,
    cb.collaborators,
    json_group_array(DISTINCT ge.name) AS genres,
    so.play_count,
    so.is_favorite,
    json_object(
        'plain', so.plain_lyrics,
        'sync', so.sync_lyrics
    ) as lyrics,
    concat ('music/songs/',so.id, '/', so.file_name) AS url,
    json_object(
        'x64', al.x64,
        'x128',al.x128,
        'x256', al.x256,
        'x512', al.x512,
        'x1200',al.x1200
    ) AS cover
FROM
    song so
    INNER JOIN album al ON al.id = so.album_id
    INNER JOIN artist ar ON ar.id = al.artist_id
    INNER JOIN song_genres sg ON sg.song_id = so.id
    INNER JOIN genre ge ON ge.id = sg.genre_id
    LEFT JOIN collab_by_song cb ON cb.song_id = so.id
GROUP BY
    so.id
ORDER BY ar.name, al.release_year, so.track_num;

-- SELECT *FROM view_song_details;
-- SELECT *FROM view_song_details WHERE song_id = 1;

-----------------------------------------------------------------------------------------------------------------------


-- MARK: ALBUM DETAILS
DROP VIEW IF EXISTS view_album_details;
CREATE VIEW view_album_details AS
WITH genres_per_song as (
    SELECT 
        sg.song_id as song_id,
        json_group_array(ge.name) as genres
    FROM genre as ge
    INNER JOIN song_genres as sg on sg.genre_id = ge.id
    GROUP BY song_id
),
collab_by_song AS (
    SELECT co.song_id, json_group_array(json_object('id', car.id, 'name', car.name)) AS collaborators
    FROM collaborations co
        INNER JOIN artist AS mar ON mar.id = co.main_id
        INNER JOIN artist as car ON car.id = co.collaborator_id
    GROUP BY
    co.song_id
)
SELECT 
    al.id as album_id,
    al.name as album_name,
    ar.id as artist_id,
    ar.name as artist_name,
    al.release_year,
    al.is_favorite,
    count(al.id) as songs_count,
    json_group_array(
        DISTINCT json_object(
                'song_id', so.id,
                'song_title', so.title,
                'artist_id', ar.id,
                'artist_name', ar.name,
                'album_id', al.id,
                'album_name', al.name,
                'track_num', so.track_num,
       
                'duration', json_object(
                    'seconds', so.duration,
                    'minutes', so.duration/60,
                    'hours', so.duration/3600
                ),
                'cover', json_object(
                    'x64',al.x64,
                    'x128', al.x128,
                    'x256', al.x256,
                    'x512', al.x512,
                    'x1200', al.x1200  
                ),
                'lyrics',json_object(
                    'plain', so.plain_lyrics,
                    'sync', so.sync_lyrics
                ),
                'release_year', al.release_year,
                'play_count', so.play_count,
                'url', concat('music/songs/',so.id,'/',so.file_name),
                'genres', gp.genres,
                'collaborators', cb.collaborators,
                'is_favorite', so.is_favorite
            ) ORDER BY so.track_num
    ) as songs,
     json_object(
      'x64',al.x64,
      'x128', al.x128,
      'x256', al.x256,
      'x512', al.x512,
      'x1200', al.x1200  
    ) as cover,
    json_object(
        'seconds',sum(so.duration),
        'minutes',sum(so.duration)/60, 
        'hours',sum(so.duration)/3600
    ) as duration
FROM album as al
INNER JOIN artist as ar on ar.id = al.artist_id
INNER JOIN song as so on so.album_id = al.id
LEFT JOIN genres_per_song as gp on gp.song_id = so.id
LEFT JOIN collab_by_song cb ON cb.song_id = so.id
GROUP BY al.id
ORDER BY ar.name;

-- SELECT *from view_album_details;
-- SELECT * FROM view_album_details WHERE album_id = 8;

-----------------------------------------------------------------------------------------------------------------------



-- MARK: ARTIST DETAILS
DROP VIEW IF EXISTS view_artist_details;

CREATE VIEW view_artist_details AS 
WITH album_details as (
SELECT
    ar.id as artist_id,
    ar.name as artist_name,
    al.id as album_id,
    al.name as album_name,
    al.release_year,
    count(al.name) as songs_count,
    sum(so.duration) as album_duration,
    json_object(
        'seconds',sum(so.duration),
        'minutes',sum(so.duration)/60,
        'hours',sum(so.duration)/3600
    ) as album_time_count,
    json_object(
      'x64',al.x64,
      'x128', al.x128,
      'x256', al.x256,
      'x512', al.x512,
      'x1200', al.x1200  
    ) as cover
FROM artist as ar
INNER JOIN album as al on al.artist_id = ar.id
INNER JOIN song as so on so.album_id = al.id
GROUP BY al.id
ORDER BY ar.id
)
SELECT 
    ar.id as artist_id,
    ar.name as artist_name,
    ar.bio,
    json_object(
      'x64',ar.x64,
      'x128', ar.x128,
      'x256', ar.x256,
      'x512', ar.x512,
      'x1200', ar.x1200  
    ) as photo,
    ar.is_favorite,
    count(ad.album_id) as albums_count,
    sum(ad.songs_count) as songs_count,
    json_object(
        'seconds',sum(ad.album_duration),
        'minutes',sum(ad.album_duration)/60,
        'hours',sum(ad.album_duration)/3600
    ) as artist_time_count,
    json_group_array(
        json_object(
            'album_name',ad.album_name,
            'album_id', ad.album_id,
            'artist_name', ad.artist_name,
            'artist_id', ad.artist_id,
            'release_year', ad.release_year,
            'songs_count', ad.songs_count,
            'duration', ad.album_time_count,
            'cover', ad.cover
        ) ORDER BY ad.release_year
    ) as albums
FROM artist as ar
LEFT JOIN album as al on al.artist_id = ar.id
LEFT JOIN album_details as ad on ad.album_id = al.id
GROUP BY ar.id;

-- SELECT * FROM view_artist_details WHERE artist_id = 16;
