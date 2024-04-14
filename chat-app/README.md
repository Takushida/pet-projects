<h1>Chat application</h1>
<h2>Run code</h2>
<ol>
  <li>
    <ul>
      <li>Create PostgreSQL database titled <strong>chat-app</strong>
        <li>Run script in the query: 
        <pre>
  CREATE TABLE users(
	  id SERIAL PRIMARY KEY,
	  username VARCHAR(28) NOT NULL UNIQUE,
	  password_hashed VARCHAR NOT NULL,
	  userId VARCHAR NOT NULL
  )
        </pre>
        </li>
      <li>Edit /server/.env configuration file (Set your settings of PostgreSQL if they differ)</li>
    </ul>
  </li>
  <li>Run redis</li>
  <li>Run server side for development (localhost:4000):
  <pre>
    cd ./backend/ 
    npm run dev</pre>
  </li>
  <li>Run client side (localhost:3000):
  <pre>
    cd ./client/
    npm start</pre>
  </li>
</ol>
<h2>Technologies:</h2>
<ul>
  <li><h3>Backend:</h3>
  <ul>
    <li>Express</li>
    <li>Redis</li>
    <li>Socket.io</li>
    <li>PostgreSQL</li>
  </ul>
  </li>
  <li><h3>Frontend:</h3>
  <ul>
    <li>React</li>
    <li>ReactRouter</li>
    <li>ChakraUI</li>
    <li>Formik</li>
  </ul>
  </li>
  <li>
    <h3>Common:</h3>
    <ul>
      <li>Yup</li>
      <li>UUID</li>
    </ul>
  </li>
</ul>
