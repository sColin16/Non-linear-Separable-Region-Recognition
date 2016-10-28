# Non-linear-Separable-Region-Recognition
A program utilizing Artificial Neural Networks to recognize regions that cannot be separated by linear bounadries

A simple visualization program, demonstrating the power of Artificial Neural Networks.

The program uses p5.js, a visualization library to draw the results of the neural network, and add a UI. 
The program also utilizes mind.js, a simple, self made neural network library, used to allow the computer to recognize regions

How to use (After downloading, opening HTML file):

1) Using the mouse, draw a line seperating the screen into two sections. 
      Generally, make sure one side of the boundary makes contact with at least one side of the edge of the program,
      the network has difficulty with circles. This is for visual comparision only. The computer does not, in any way 
      analyze the boundary drawn. Skip this step, or draw a fake boundary to demonstrate this.
      
2)Click "Continue." I know this button doesn't interact with the user. Sorry.

3)Drop training points for the network. Ctrl+Click to drop class A (red points), Shift+Click to drop class B (blue points).
      Generally, the more points, the better, although with enough points, the computer will "jump," as the learning rate is too high.
      Placing points near the boundary is most helpful, although points in other areas can aid in accuracy of the recognition
      
4)Click "Train Network"

5)The network will begin training, processing 250 iterations per frame. Each frame, its updates its progress on screen,
      through a breif drawing of the results thus far. When the network seems accurate enough, click on the canvas to stop it.
      You may have to click mulitple times, if the frame rate is low.
      
6)The network will present a finished product, accounting for the entire screen. Compare the results to the boundary drawn.


Future feature list:
1)Better UI. Increase interactivity of UI, allowing for points to be removed, etc. Allow for saving a network from the UI,
      making the program attempt the training data again.
      
2)More hidden layers. The network has difficulty recognizing regions that do not have an edge on the edge of the program.
      I beleive that adding more layers to the network will aid in this, as adding more hidden units is not a solution,
      and neural networks are capable of more complex things.
