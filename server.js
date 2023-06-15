const app = require( './app' );
const PORT = 4041;

app.listen( PORT, () => {
    console.log(`Server is listening to port: ${PORT}`);
})