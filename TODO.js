// TODO: Adjust the 'games' route to make a query to only get the columns of the game's info that I'm going to use.
// TODO: Add a 404 page.
// FIX: Figure out why the deletion of a publisher from the 'publishers' table deletes the game itself, probably is a 'on delete cascade' on the publishers table. Should be 'on delete set null';