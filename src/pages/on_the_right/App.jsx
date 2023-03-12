import MDRenderer from '../../Components/MDRenderer';
import Constants from '../../Constants';

function App() {
    var onPhone = Constants.phonePattern.test(window.navigator.userAgent);
    if (onPhone) {
        var style = document.createElement("STYLE");
        style.innerHTML += "div#root > div.container {margin:0px;margin-top:50px;zoom:225%;}";
        
        document.head.appendChild(style);
      }
    return (
        <MDRenderer md={Constants.on_the_right} />
    );
}

export default App;