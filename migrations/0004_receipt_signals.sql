-- What the edge saw when a request was posted: host, referer, user agent, country, network (ASN) and how long
-- the form was open. Written in the same INSERT as the receipt, so it adds no rows. No IP address is stored.
ALTER TABLE lead_receipts ADD COLUMN signals_json TEXT;
