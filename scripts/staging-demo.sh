#!/usr/bin/env bash
# Synthetic lead-to-fee walkthrough against a local staging Worker (npm run dev must be running).
# Uses only fixture markets and fake contact data.
B=http://localhost:8787
echo "--- pages"; for p in / /locations/kansas-city/ /locations/demo-dealer/ /water-softeners/ /how-it-works/ /privacy/ /service-areas/ /nope; do echo "$p $(curl -s -o /dev/null -w '%{http_code}' $B$p)"; done
echo "--- zip check"; curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' "$B/check?zip=00001"; curl -s "$B/check?zip=64105" | grep -o '<h1>[^<]*'
echo "--- KC page"; curl -s $B/locations/kansas-city/ | grep -o 'Not open yet' | head -1
RID=$(curl -s $B/locations/demo-dealer/ | grep -o 'name="request_id" value="[^"]*' | cut -d'"' -f4); echo "rid=$RID"
POST() { curl -s -X POST $B/api/inquiry -H 'content-type: application/x-www-form-urlencoded' --data "request_id=$RID&market=demo-dealer&zip=00001&homeowner=yes&concern=hardness&water_source=municipal&first_name=Demo&last_name=Homeowner&contact_method=phone&phone=5550101234&email=demo@example.com&consent_service=yes&page=/locations/demo-dealer/" ; }
echo "--- submit"; POST | grep -o '<h1>[^<]*\|<p>Example[^<]*'
echo "--- resubmit same id"; POST | grep -o '<h1>[^<]*'
echo "--- invalid"; curl -s -X POST $B/api/inquiry --data "request_id=$RID&market=demo-dealer&zip=00001" | grep -o 'id="[a-z_]*-err' | head -3
echo "--- cron"; curl -s "$B/__scheduled?cron=*+*+*+*+*" ; echo
echo "--- report"; curl -s -H 'authorization: Bearer staging-admin' $B/internal/report | python3 -c "import json,sys;d=json.load(sys.stdin);[print(m['market_id'],'leads',m['leads'],'assigned',m['funnel']['assignment_pending']) for m in d['markets']];print('exceptions',d['open_exceptions'],'stuck',d['stuck_jobs'])"
echo "--- no auth"; curl -s -o /dev/null -w '%{http_code}\n' $B/internal/report
echo "--- headers"; curl -sI $B/ | grep -i "content-security\|cache-control"
echo "--- dealer journey via link"
H='authorization: Bearer staging-admin'
AID=$(curl -s -H "$H" $B/internal/opportunities | python3 -c "import json,sys;print([o for o in json.load(sys.stdin) if o['assignment_id']][0]['assignment_id'])")
URL=$(curl -s -X POST -H "$H" $B/internal/link -d "{\"assignment_id\":\"$AID\"}" | python3 -c "import json,sys;print(json.load(sys.stdin)['url'])")
echo "link ok: ${URL:0:40}..."
curl -s "$URL" | grep -o 'Contact details appear after you accept'
V() { curl -s -H "$H" $B/internal/opportunities | python3 -c "import json,sys;print([o for o in json.load(sys.stdin) if o['assignment_id']=='$AID'][0]['state_version'])"; }
curl -s -X POST "$URL" --data "action=accept&version=$(V)" | grep -o 'Accepted.\|+1555[0-9]*'
for st in appointment_booked "appointment_held&evidence=cal-1" quote_issued customer_accepted install_scheduled "installed&evidence=WO-1" "collected&evidence=INV-1"; do
  curl -s -X POST "$URL" --data "action=state:$st&version=$(V)" | grep -o 'Recorded: [A-Za-z ]*'
done
curl -s "$B/__scheduled?cron=*+*+*+*+*" >/dev/null
curl -s -H "$H" $B/internal/report | python3 -c "import json,sys;d=json.load(sys.stdin);m=[m for m in d['markets'] if m['market_id']=='demo-dealer'][0];print('funnel',m['funnel']);print('money',m['money_cents'])"
