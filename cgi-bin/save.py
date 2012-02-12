#!/usr/bin/python
import cgi, cgitb, sys, sqlite3
cgitb.enable()
print('content-type: text/html\n')

rfields = ['id', 'content']
form = cgi.FieldStorage()
for i in rfields:
    if i not in form:
        print ('ERROR: required value {0} not supplied').format(i)
        sys.exit(1)
        
id = form['id'].value
content = form['content'].value

conn = sqlite3.connect('../../www-db/stuff.db')
c = conn.cursor()
#See if item exists...
c.execute('select id from items')
for i in c:
    if i[0] == id:
        #Item does exist
        c.execute('update items set content=? where id=?', (content, id,))
        conn.commit()
        c.close()
        print('Successful')
        sys.exit(0)
        
#The item does not exist, so create it
c.execute('insert into items values (?, ?)', (id, content,))
conn.commit()
c.close()
print('Successful')