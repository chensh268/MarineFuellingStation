﻿using MFS.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MFS.Hubs
{
    public class PrintHub : Hub
    {
        public readonly static ConnectionMapping<string> connections = new ConnectionMapping<string>();
        public Task PrintSalesPlan(SalesPlan model)
        {
            return Clients.All.InvokeAsync("printsalesplan", model);
        }
        public Task PrintOrder(Order model)
        {
            return Clients.All.InvokeAsync("printorder", model);
        }
        public Task PrintUnload(Purchase model)
        {
            return Clients.All.InvokeAsync("printunload", model);
        }
        public Task PrintMoveStore(MoveStore model)
        {
            return Clients.All.InvokeAsync("printmovestore", model);
        }
        public Task Login(string username)
        {
            return Clients.All.InvokeAsync("login", username);
        }
        public Task Conn(string client)
        {
            connections.Add(client, Context.ConnectionId);
            return Task.FromResult(0);
        }
    }
}
