const { Client } = require("pg");
const { argv } = require("node:process");

const SQL = `

    INSERT INTO publishers (name) VALUES
    ('sony computer entertainment'),
    ('electronic arts'),
    ('activision'),
    ('capcom'),
    ('square enix'),
    ('konami'),
    ('thq'),
    ('ubisoft'),
    ('sega'),
    ('atari'),
    ('namco bandai games'),
    ('rockstar games'),
    ('midway games'),
    ('eidos interactive'),
    ('lucasarts'),
    ('codemasters'),
    ('acclaim entertainment'),
    ('snk playmore'),
    ('2k games'),
    ('tecmo'),
    ('vivendi universal games'),
    ('bethesda softworks'),
    ('warner bros. interactive entertainment'),
    ('infogrames'),
    ('bam! entertainment'),
    ('crave entertainment'),
    ('redoctane'),
    ('genki'),
    ('ignition entertainment'),
    ('atlus'),
    ('majesco entertainment'),
    ('koei'),
    ('bandai'),
    ('sammy studios'),
    ('cave'),
    ('fromsoftware'),
    ('hudson soft'),
    ('spike'),
    ('nippon ichi software'),
    ('gotham games'),
    ('xseed games'),
    ('d3 publisher'),
    ('success'),
    ('empire interactive'),
    ('natsume'),
    ('505 games'),
    ('snk'),
    ('idea factory'),
    ('agetec'),
    ('microids'),
    ('metro3d'),
    ('treasure co. ltd'),
    ('midas interactive entertainment'),
    ('strategy first'),
    ('takara'),
    ('encore, inc.'),
    ('southpeak interactive'),
    ('jaleco'),
    ('kemco'),
    ('zoo digital publishing');

    INSERT INTO genres (name) VALUES 
    ('action'),
    ('action-adventure'),
    ('adventure'),
    ('beat ''em up'),
    ('board game'),
    ('compilation'),
    ('educational'),
    ('fighting'),
    ('first-person shooter'),
    ('flight'),
    ('hack and slash'),
    ('life simulation'),
    ('music / rhythm'),
    ('party'),
    ('platformer'),
    ('puzzle'),
    ('racing'),
    ('real-time strategy'),
    ('role-playing'),
    ('shooter'),
    ('simulation'),
    ('sports'),
    ('stealth'),
    ('strategy'),
    ('survival horror'),
    ('third-person shooter'),
    ('turn-based strategy'),
    ('visual novel'),
    ('wrestling');

    INSERT INTO games (title, description,release_date, publisher_id) VALUES 
    ('god of war 2', 'God of War II, the follow-up to the hit action game, follows the anti-hero Kratos on his journey from godhood back to mortality. After being stripped of his godly powers and forced to watch his armies reduced to dust at the start of the adventure, Kratos makes it his mission to do the unthinkable - kill Zeus.', '03-13-2007', 1),
    ('resident evil 4', 'Resident Evil 4 is a 2005 survival horror game developed and published by Capcom for the GameCube. Players control the special agent Leon S. Kennedy on a mission to rescue the US president''s daughter, Ashley Graham, who has been kidnapped by a religious cult in rural Spain.', '01-11-2005', 4),
    ('devil may cry 3: dante''s awakening', 'The game is a prequel to the original Devil May Cry, featuring a younger Dante. Set a decade before the events of the first Devil May Cry in an enchanted tower, Temen-ni-gru, the story centers on the dysfunctional relationship between Dante and his brother Vergil.', '02-17-2005', 4),
    ('mortal kombat shaolin monks', 'Mortal Kombat: Shaolin Monks spans the events of Mortal Kombat II, starting with the aftermath of the first Mortal Kombat. The battle rages furiously on Shang Tsung''s island fortress in the Lost Sea, as the sorcerer watches the fighters battle his soldiers to protect Earthrealm.', '09-19-2005', 13),
    ('black', 'Gameplay involves players confronting enemies by using firearms and grenades. The game is notable and was heavily promoted for its large focus on destructive effects and explosions during gameplay, as well as its cinema-inspired action and sound quality. Black received positive to mixed reviews upon release.', '02-23-2006', 2),
    ('okami', 'From Capcom''s Clover studios, the team behind Viewtiful Joe 2, comes a 3-D cell-shaded action game in the world of feudal Japan. Ōkami tells the tale of a wolf-goddess named Amaterasu who must prevent an evil being known as Orochi from taking over the beautiful world of feudal Japan. Ōkami takes the already well-established cell shading technique and turns it into a traditional Hokusai-style Japanese woodblock print visual. To give the player a sense of being in a painting, Amaterasu is given a paintbrush which the player can cut enemies down with, create bridges or wind, and restore the forest to its natural beauty. With each defeated enemy, color returns, and the natural life force slowly regenerates. While playing, players call up a canvas where they can draw with the celestial brush. New abilities and techniques are acquired as you progress. Ōkami is filled with large worlds and dungeons to explore on your quest to restore the lush trees and wildlife to their former glory. Many monsters and large epic boss battles come between Amaterasu and her goal. To fulfill her objective there will be many people along the way that will help her if she helps them.', '04-20-2006',  4),
    ('grand theft auto: san andreas', 'The events of the game take place in the early 1990s. The player takes control of Carl Johnson (C.J.), who had moved to Liberty City in order to distance himself from his past as a member of a gang in his home city, San Andreas. But the past catches up with him in a way he had not imagined: he finds out that his mother was killed by a rival gang. He goes back to San Andreas to attend her funeral. Realizing how corrupted local police is, seeing how his relatives and friends need him, determined to avenge his mother''s death, C. J. has no other choice but to revert to his old ways.', '10-26-2004', 12);

    INSERT INTO covers (game_id, url) VALUES 
    (1, 'https://cdn.mobygames.com/covers/4804311-god-of-war-ii-playstation-2-front-cover.png'),
    (2, 'https://cdn.mobygames.com/covers/4480917-resident-evil-4-playstation-2-front-cover.jpg'),
    (3, 'https://cdn.mobygames.com/covers/4258870-devil-may-cry-3-dantes-awakening-playstation-2-front-cover.jpg'),
    (4, 'https://cdn.mobygames.com/covers/4746981-mortal-kombat-shaolin-monks-playstation-2-front-cover.jpg'),
    (5, 'https://cdn.mobygames.com/covers/4359409-black-playstation-2-front-cover.jpg'),
    (6, 'https://cdn.mobygames.com/covers/4362697-okami-playstation-2-front-cover.jpg'),
    (7, 'https://cdn.mobygames.com/covers/5758782-grand-theft-auto-san-andreas-playstation-2-front-cover.png');

    INSERT INTO games_genres (game_id, genre_id) SELECT 1, UNNEST(ARRAY[1,3,11,16]);
    INSERT INTO games_genres (game_id, genre_id) SELECT 2, UNNEST(ARRAY[1,16,20,25]);
    INSERT INTO games_genres (game_id, genre_id) SELECT 3, UNNEST(ARRAY[1,11]);
    INSERT INTO games_genres (game_id, genre_id) SELECT 4, UNNEST(ARRAY[1,4]);
    INSERT INTO games_genres (game_id, genre_id) SELECT 5, UNNEST(ARRAY[1,20]);
    INSERT INTO games_genres (game_id, genre_id) SELECT 6, UNNEST(ARRAY[1,16]);
    INSERT INTO games_genres (game_id, genre_id) SELECT 7, UNNEST(ARRAY[1,3,12]);


`;
// TODO: add one last game to the database.

async function main() {
    console.log("Inserting...");
    const client = new Client({
        connectionString: argv[2],
    });

    await client.connect();
    await client.query(SQL);
    await client.end();

    console.log("Data inserted!");
}

main();
