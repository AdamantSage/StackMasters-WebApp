const initializeShapes = () => {
    let circle = new paper.Path.Circle({
      center: paper.view.center,
      radius: 50,
      fillColor: 'blue'
    });
  
    paper.view.onFrame = () => {
      circle.rotate(1);
    };
  };
  