## 3d cube in three js

### Getting started

Step 1:
Go to the directory.

```bash
npm install
```

Step 2:

```bash
npm run dev
```

Step 3:
Ctrl+Click at the http://localhost:5173/

### You can now interact with the cube.

There are buttons for usual cube moves. You can do the movs
You can change prespective of the cube.

### Change color of cube.

The color of cube is taken from the object of arrays of different side. Change the color according to the usual color names of rubik's cube in lowercase.

### Understanding moves in cube

If you want to automate the moves then you can tinker with the moves array. Which contains position(side) and values(direction) for side moves eg {right,-1}. It can contain position only for the entirity of the cube for cube movements like rotating the whole cube eg {rotateUp,1}. Look up to index.html's buttons.

The axis is grouped to do rotation of a side. The whole cube is grouped to do rotation of the cube.
