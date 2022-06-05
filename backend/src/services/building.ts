import os from 'os';
import pty from "node-pty";
import { spawn } from 'child_process';
import { Building, Repository } from '@/databases/model';
var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

export const buildRepository = async (io, socket, repo) => {
    console.log('Starting shell..')
    // console.log(repo)
    // var ptyProcess = pty.spawn(shell, [], {
    //     name: 'xterm-color',
    //     cols: 80,
    //     rows: 30,
    //     cwd: process.env.HOME,
    //     env: process.env
    // });

    // ptyProcess.onData(function (data) {
    //     process.stdout.write(data);
    //     socket.emit('build.log', data);
    // });

    // ptyProcess.write(`ls \r`)

    // socket.on('build.stdin', function (message) {
    //     ptyProcess.write(`${message}\r`);
    // });

    // ptyProcess.onExit(function (code) {
    //     socket.state.build = false;
    //     console.log(`exit code: ${code}`);
    // });
    const cmd = spawn('node', ['index.js'], { stdio: ['inherit', 'pipe', 'pipe'], env: { ...process.env } });

    let time = Date.now();
    let isError = false;
    // cmd.stdout.on('data', (data) => {
    //     sk.emit('build.log', data.toString());
    // });

    // cmd.stderr.on('data', (data) => {
    //     io.emit('build.log', data.toString());
    // });

    // cmd.stdout.pipe(process.stdout);
    // cmd.stdin.pipe(process.stdin);


    cmd.stdout.on('data', (data) => {
        // process.stdout.write(data);
        io.emit('build.log', data.toString());
    });

    cmd.stderr.on('data', (data) => {
        // process.stdout.write(data);
        io.emit('build.err', data.toString());
        isError = true;
        io.emit('build.end', repo.id);
    });

    cmd.stdout.on('end', (code) => {
        socket.state.building = false;
        Building.create({
            repository_id: repo.id,
            owner_id: repo.owner_id,
            status: isError ? 'error' : 'success',
            time: Date.now() - time,
            created_at: new Date(),
            updated_at: new Date()
        });

        Repository.updateOne({
            id: repo.id,
            owner_id: repo.owner_id,
            status: isError ? 'error' : 'success',
            updated_at: new Date()
        });

        socket.emit('build.end', code);
    });

    cmd.on('close', (code) => {
        socket.state.building = false;
        socket.emit('build.end', code);
    });

};