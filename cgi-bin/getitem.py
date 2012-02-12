#!/usr/bin/python
import cgi, cgitb, sys, sqlite3
cgitb.enable()
print('content-type: text/html\n')

rfields = ['id']
form = cgi.FieldStorage()
for i in rfields:
    if i not in form:
        print ('ERROR: required value {0} not supplied').format(i)
        sys.exit(1)
        
id = int(form['id'].value)

conn = sqlite3.connect('../../www-db/stuff.db')
c = conn.cursor()
#See if item exists...
c.execute('select content from items where id=?', (id,))
for i in c:
    print(i[0])
    sys.exit(0)
        

print('ERROR: id not in table')