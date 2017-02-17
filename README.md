
# Steam CDN Enumerate

Retrieves a list of all known CDN servers in Valve's SteamPipe network
and writes them to stdout.

# Usage

```
git clone git@github.com:OpenSourceLAN/steam-cdn-enumerate .
npm install
node index.js 2>/dev/null
```

# Why?

Most people run their LAN cache installs by hijacking a set of certain DNS
entries. In the past, I have seen hosts in the list which do not follow
the usual patterns. If a Steam client uses this it would then bypass
the cache.

This app will get a list of servers from every region allowing you to
sanity check that all CDN hosts are covered by your DNS poisoning strategy.

# Quick script to sanity check

Run this to validate that your cache has every address covered

```
#!/bin/bash

MYCACHEIP="10.0.0.2"

for HOSTNAME in $(node index.js 2>/dev/null)
do
   IP=$(dig $HOSTNAME +short)
   [[ "$MYCACHEIP" == "$IP" ]] || echo "$HOSTNAME not DNS poisoned - returned $IP"
done

```

Note that any lines that have just an IP or hostname on them are a follow on from
the results returned by an earlier line. For example, 
`dig cdn.edgecast.cs.steampowered.com +short` returns a list of about 8 hosts.

# License

GPL v3.0 license.