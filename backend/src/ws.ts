import { Server as IOServer } from 'socket.io'

export let io: IOServer

export function initWS (_io: IOServer) {
  io = _io
}