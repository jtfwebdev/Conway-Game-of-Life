const Description = () => {
    return ( 
        <div className="description">
            <p>The infinite, two-dimensional grid holds square cells, each of which possesses one of two states (alive or dead). Once the animation is started, the cell population evolves according to four rules: </p>
            <ul>
                <li>Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>
                <li>Any live cell with two or three live neighbours lives on to the next generation.</li>
                <li>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
                <li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
            </ul>
            <p>The generational evolution of the cell population can produce some fascinating patterns and oscillations. Click on the grid to add some live cells, or select a preset from the dropdown menu. </p>
        </div>
     );
}
 
export default Description;