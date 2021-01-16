export const ip_backend = '34.76.50.180:8000';

export const attributes = 'http://'+ip_backend+'/general/attributes/';
// Tickets
export const add_tickets = 'http://'+ip_backend+'/cafeteria/addTickets';
export const validate_ticket = 'http://'+ip_backend+'cafeteria/validateTicket';
// Library
export const room = 'http://'+ip_backend+ 'library/rooms/';
export const free_rooms = 'http://'+ip_backend+ 'library/freeRooms/';
export const reservations = 'http://'+ip_backend+ 'library/reservations/';
export const free_times =  'http://'+ip_backend+ 'library/freeTimes/';

export const auth_url = 'http://'+ ip_backend +'/general/all/';

export const root_cert_pem = "-----BEGIN CERTIFICATE-----\nMIIB5zCCAYygAwIBAgIUfXvkGUCKhlIQD0shLHgYjqEOVc0wCgYIKoZIzj0EAwIw\nUTELMAkGA1UEBhMCUFQxDjAMBgNVBAgTBUJyYWdhMQ4wDAYDVQQHEwVCcmFnYTEP\nMA0GA1UEChMGVW1pbmhvMREwDwYDVQQDEwh1bWluaG9DQTAeFw0yMTAxMTUxNzM1\nMDBaFw0yNjAxMTQxNzM1MDBaMFExCzAJBgNVBAYTAlBUMQ4wDAYDVQQIEwVCcmFn\nYTEOMAwGA1UEBxMFQnJhZ2ExDzANBgNVBAoTBlVtaW5obzERMA8GA1UEAxMIdW1p\nbmhvQ0EwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAAQyBh82K8odhV9YnVY+muuh\noOlbpYN5wzlMAI20r2yic5xp9X7a9Qjy5FCkMOJE4XrdgkcalF0PbPy/kNoid/qH\no0IwQDAOBgNVHQ8BAf8EBAMCAQYwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQU\nHRAID2G7csPcKFosDkcboY2Ko7YwCgYIKoZIzj0EAwIDSQAwRgIhAPMQVoVhoWVX\n+vbmEH4ZhT8uk4HXSOjQgZsjs4R3T635AiEAp5JEXXn1CMnugAn7O27nUlidRgTH\nfcJqkQcsM8NQgto=\n-----END CERTIFICATE-----";