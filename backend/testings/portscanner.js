const { exec } = require('child_process');

const targetIP = '192.168.29.163';

exec(`nmap  ${targetIP}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Exec error: ${error}`);
        return;
    }
    console.log(`Nmap Output:\n${stdout}`);
});
