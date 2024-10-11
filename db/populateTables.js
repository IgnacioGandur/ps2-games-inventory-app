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
