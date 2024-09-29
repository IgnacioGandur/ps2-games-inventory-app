const { Client } = require("pg");
const { argv } = require("node:process");

const SQL = `

    INSERT INTO publishers (publisher_name) VALUES
    ('Sony Computer Entertainment'),
    ('Electronic Arts'),
    ('Activision'),
    ('Capcom'),
    ('Square Enix'),
    ('Konami'),
    ('THQ'),
    ('Ubisoft'),
    ('Sega'),
    ('Atari'),
    ('Namco Bandai Games'),
    ('Rockstar Games'),
    ('Midway Games'),
    ('Eidos Interactive'),
    ('LucasArts'),
    ('Codemasters'),
    ('Acclaim Entertainment'),
    ('SNK Playmore'),
    ('2K Games'),
    ('Tecmo'),
    ('Vivendi Universal Games'),
    ('Bethesda Softworks'),
    ('Warner Bros. Interactive Entertainment'),
    ('Infogrames'),
    ('BAM! Entertainment'),
    ('Crave Entertainment'),
    ('RedOctane'),
    ('Genki'),
    ('Ignition Entertainment'),
    ('Atlus'),
    ('Majesco Entertainment'),
    ('Koei'),
    ('Bandai'),
    ('Sammy Studios'),
    ('Cave'),
    ('FromSoftware'),
    ('Hudson Soft'),
    ('Spike'),
    ('Nippon Ichi Software'),
    ('Gotham Games'),
    ('Xseed Games'),
    ('D3 Publisher'),
    ('Success'),
    ('Empire Interactive'),
    ('Natsume'),
    ('505 Games'),
    ('SNK'),
    ('Idea Factory'),
    ('Agetec'),
    ('Microids'),
    ('Metro3D'),
    ('Treasure Co. Ltd'),
    ('Midas Interactive Entertainment'),
    ('Strategy First'),
    ('Takara'),
    ('Encore, Inc.'),
    ('SouthPeak Interactive'),
    ('Jaleco'),
    ('Kemco'),
    ('Zoo Digital Publishing');

    INSERT INTO genres (genre_name)
        VALUES 
            ('action'),
            ('adventure'),
            ('action-adventure'),
            ('role-playing (rpg)'),
            ('sports'),
            ('racing'),
            ('fighting'),
            ('shooter (first-person or third-person'),
            ('platformer'),
            ('survival horror'),
            ('simulation'),
            ('puzzle'),
            ('strategy'),
            ('stealth'),
            ('rhythm'),
            ('party'),
            ('beat\''em up'),
            ('hack and slash');

    INSERT INTO games (game_name, game_description, release_date, publisher_id) 
        VALUES 
            (
                'GTA: San Andreas',
                'Nec, sapien tincidunt ullamcorper dictum, turpis dictumst magna finibus rutrum. Feugiat eu, ultricies tortor dui nullam, turpis nulla quisque ac.',
                '2020-01-30',
                1
        ),
            (
                'god of war 2',
                'Nec, sapien tincidunt ullamcorper dictum, turpis dictumst magna finibus rutrum. Feugiat eu, ultricies tortor dui nullam, turpis nulla quisque ac.',
                '2020-01-30',
                2
        );
`;

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
