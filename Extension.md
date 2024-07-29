Context

You're going to be working with our engineers to extend your robot solution to take into some new scenarios that have arisen.

As a TL;DR summary we'd like:

Our operators would like the be able to move the robot backwards.
Our robot operators to be able to have a shorthand for repeating movements.
Our robot to be more efficient when following wandering directions.
We recommend that you tackle these in sequence.

Scenarios

Backwards

Some of our robot operators would like to be able to move the robot backwards. At the moment they do this by turning the robot around, moving forward, and then turning it back again, i.e. "left, left, forward, left, left".

We would like you to implement the backward direction.

For example, if the input file is:

{
"arena": {
"corner1": { "x": -3, "y": -3 },
"corner2": { "x": 3, "y": 3 }
},

"location": { "x": 0, "y": 0 },
"heading": "north",

"directions": ["backward"]
}
Then the output should be:

{
"status": "ok",
"location": { "x": 0, "y": -1 },
"heading": "north",

"path": ["backward"]
}
Movement repetition

We've decided we'd like to be able to compress sequences of repeated movements in our directions. For example, instead of "forward, forward, forward" we want to be able to tell the robot "forward 3 times".

We need you to extend the robot code to support this.

We've decided the format of this will be <movement>(<repeats>). And we'd like your output path to be the expanded version.

For example, if the input file is:

{
"arena": {
"corner1": { "x": -3, "y": -3 },
"corner2": { "x": 3, "y": 3 }
},

"location": { "x": 0, "y": 0 },
"heading": "north",

"directions": ["forward(3)", "left(2)", "forward"]
}
Then the output should be:

{
"status": "ok",
"location": { "x": 0, "y": 2 },
"heading": "south",

"path": ["forward", "forward", "forward", "left", "left", "forward"]
}
Removing loops

Some of our robot operators have been creating paths that waste valuable battery reserves. In a significant number of cases there have been paths with loops in them, where the robot returns to a previous coordinate.

We'd like you to perform an optimisation on any path: remove any loops.

For example, the most recent case was with the following input file:

{
"arena": {
"corner1": { "x": -3, "y": -3 },
"corner2": { "x": 3, "y": 3 }
},

"location": { "x": 0, "y": 0 },
"heading": "north",

"directions": [
"forward",
"forward",
"left",
"forward",
"left",
"forward",
"left",
"forward",
"left",
"forward"
]
}
The loop can be removed so that the output would be:

{
"status": "ok",
"location": { "x": 0, "y": 2 },
"heading": "north",

"path": ["forward", "forward"]
}
