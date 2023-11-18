
// ######################

public class Point {
public float x;
public float y;

public Point(float _x, float _y) {
    x = _x;
    y = _y;
}

public static float area(Point a, Point b, Point c) {
    return (((b.x - a.x)*(c.y - a.y))-((c.x - a.x)*(b.y - a.y)));
}

public static boolean left(Point a, Point b, Point c) {
    return area(a, b, c) > 0;
}

public static boolean leftOn(Point a, Point b, Point c) {
    return area(a, b, c) >= 0;
}

public static boolean rightOn(Point a, Point b, Point c) {
    return area(a, b, c) <= 0;
}


public static boolean right(Point a, Point b, Point c) {
    return area(a, b, c) < 0;
}

public static float sqdist(Point a, Point b) {
    float dx = b.x - a.x;
    float dy = b.y - a.y;
    return dx * dx + dy * dy;
}
} 

// ######################

import java.util.Vector;
public class Polygon extends Vector<Point> {
        @Override
        public Point get(int i)  {
            // hacky way of getting the modulo
            return super.get(((i % this.size()) + this.size()) % this.size());
        }
}

// ######################

import org.lwjgl.*;
import org.lwjgl.glfw.*;
import org.lwjgl.opengl.*;
import org.lwjgl.system.*;

import java.nio.*;

import static org.lwjgl.glfw.Callbacks.*;
import static org.lwjgl.glfw.GLFW.*;
import static org.lwjgl.opengl.GL11.*;
import static org.lwjgl.system.MemoryStack.*;
import static org.lwjgl.system.MemoryUtil.*;

import java.util.Collections;
import java.util.Vector;

public class DecomposePolyExample {

    private long window;

    private int WIDTH = 300;
    private int HEIGHT = 300;

    private float mouse_x = WIDTH / 2;
    private float mouse_y = HEIGHT / 2;

    private Polygon incPoly = new Polygon();

    private Vector<Polygon> polys = new Vector<Polygon>();
    private Vector<Polygon> tris = new Vector<Polygon>();
    private Vector<Point> steinerPoints = new Vector<Point>();
    private Vector<Point> reflexVertices = new Vector<Point>();

    private boolean polyComplete = false;

    public void run() {
        System.out.println("Hello LWJGL" + Version.getVersion() + "!");

        init();
        loop();

        // Free the window callbacks and destroy the window
        glfwFreeCallbacks(window);
        glfwDestroyWindow(window);

        // Terminate GLFW and free the error callback
        glfwTerminate();
        glfwSetErrorCallback(null).free();
    }

    private void init() {

        // Setup and error callback. The default implementation
        // will print the error message in System.err.
        GLFWErrorCallback.createPrint(System.err).set();

        // Initialize GLFW. Most GLFW functions will not work before doing this.
        if (!glfwInit()) {
            throw new IllegalStateException("Unable to initialize GLFW");
        }

        // Create the window
        window = glfwCreateWindow(WIDTH, HEIGHT, "Hello World!", NULL, NULL);
        if (window == NULL) {
            throw new RuntimeException("Failed to create the GLFW window");
        }

        // Setup a key callback. It will be called every time a key is pressed, repeated or released.
        glfwSetKeyCallback(window, (window, key, scancode, action, mods) -> {
            if ( key == GLFW_KEY_ESCAPE && action == GLFW_RELEASE) {
                glfwSetWindowShouldClose(window, true); // We will detect this in the rendering loop
            }
        });

        glfwSetCursorPosCallback(window, (window, x, y) -> {
            mouse_x = (float)x;
            mouse_y = HEIGHT - (float)y;
        });

        glfwSetMouseButtonCallback(window, (window, button, action, mods) -> {
            if (action != GLFW_PRESS){
                return;
            }
            int lClick = glfwGetMouseButton(window, GLFW_MOUSE_BUTTON_LEFT);
            if (lClick == GLFW_PRESS)
            {
                Point p = new Point(mouse_x, mouse_y);
                incPoly.add(p);
            }
            int rClick = glfwGetMouseButton(window, GLFW_MOUSE_BUTTON_RIGHT);
            if (rClick == GLFW_PRESS)
            {
                polyComplete = true;
                incPoly = makeCCW(incPoly);
                decomposePoly(incPoly);
                triangulatePoly(polys); 
            }
        });

        // Make the OpenGL context current
        glfwMakeContextCurrent(window);
        // Enable v-sync
        glfwSwapInterval(1);

        // Make the window visible
        glfwShowWindow(window);
    }

    public Point toNDC(Point p) {
        float x = 2*p.x / WIDTH - 1;
        float y = 2*p.y / HEIGHT - 1;
        return new Point(x, y);
    }

    public Polygon makeCCW(Polygon poly) {
        int br = 0;

        // find bottom right point
        for (int i = 1; i < poly.size(); ++i) {
            if (poly.get(i).y < poly.get(br).y || (poly.get(i).y == poly.get(br).y && poly.get(i).x > poly.get(br).x)) {
                br = i;
            }
        }

        // reverse poly if clockwise
        if (!Point.left(poly.get(br - 1), poly.get(br), poly.get(br + 1))) {
            Collections.reverse(poly);
        }
       return poly;
    }

    public boolean isReflex(Polygon poly, int i) {  
        return Point.right(poly.get(i - 1), poly.get(i), poly.get(i + 1));
    }

    public boolean eq(float a, float b) {
        return Math.abs(a - b) <= 1e-8;
    }

    Point intersection(Point p1, Point p2, Point q1, Point q2) {
        Point i = new Point(0,0);
        float a1, b1, c1, a2, b2, c2, det;
        a1 = p2.y - p1.y;
        b1 = p1.x - p2.x;
        c1 = a1 * p1.x + b1 * p1.y;
        a2 = q2.y - q1.y;
        b2 = q1.x - q2.x;
        c2 = a2 * q1.x + b2 * q1.y;
        det = a1 * b2 - a2*b1;
        if (!eq(det, 0)) { // lines are not parallel
            i.x = (b2 * c1 - b1 * c2) / det;
            i.y = (a1 * c2 - a2 * c1) / det;
        }
        return i;
    }

    public void decomposePoly(Polygon poly) {
        Point upperInt = new Point(0,0);
        Point lowerInt = new Point(0,0);
        Point p = new Point(0,0);
        Point closestVert = new Point(0,0);

        float upperDist, lowerDist, d, closestDist;
        int upperIndex = 0;
        int lowerIndex = 0;
        int closestIndex = 0;
        Polygon lowerPoly = new Polygon();
        Polygon upperPoly = new Polygon();
        for (int i = 0; i < poly.size(); ++i) {
            if (isReflex(poly, i)) {
                reflexVertices.add(poly.get(i));
                upperDist = lowerDist = Float.MAX_VALUE;
                for (int j = 0; j < poly.size(); ++j) {
                    if (Point.left(poly.get(i - 1), poly.get(i), poly.get(j))
                            && Point.rightOn(poly.get(i - 1), poly.get(i), poly.get(j - 1))) { // if line intersects with an edge
                        p = intersection(poly.get(i - 1), poly.get(i), poly.get(j), poly.get(j - 1)); // find the point of intersection
                        if (Point.right(poly.get(i + 1), poly.get(i), p)) { // make sure it's inside the poly
                            d = Point.sqdist(poly.get(i), p);
                            if (d < lowerDist) { // keep only the closest intersection
                                lowerDist = d;
                                lowerInt = p;
                                lowerIndex = j;
                            }
                        }
                    }
                    if (Point.left(poly.get(i + 1), poly.get(i), poly.get(j + 1))
                            && Point.rightOn(poly.get(i + 1), poly.get(i), poly.get(j))) {
                        p = intersection(poly.get(i + 1), poly.get(i), poly.get(j), poly.get(j + 1));
                        if (Point.left(poly.get(i - 1), poly.get(i), p)) {
                            d = Point.sqdist(poly.get(i), p);
                            if (d < upperDist) {
                                upperDist = d;
                                upperInt = p;
                                upperIndex = j;
                            }
                        }
                    }
                }

                // if there are no vertices to connect to, choose a point in the middle
                if (lowerIndex == (upperIndex + 1) % poly.size()) {
                    p.x = (lowerInt.x + upperInt.x) / 2;
                    p.y = (lowerInt.y + upperInt.y) / 2;
                    steinerPoints.add(p);

                    if (i < upperIndex) {
                        for (int j = i; j < upperIndex + 1; j++) {
                            lowerPoly.add(poly.get(j));
                        }
                        lowerPoly.add(p);
                        upperPoly.add(p);
                        if (lowerIndex != 0) {
                            for (int j = lowerIndex; j < poly.size(); j++) {
                                upperPoly.add(poly.get(j));
                            }
                        }
                        for (int j = 0; j < i + 1; j++) {
                            upperPoly.add(poly.get(j));
                        }

                    } else {
                        if (i != 0) {
                            for (int j = 0; j < i; j++) {
                                lowerPoly.add(poly.get(j));
                            }
                        }
                        for (int j = 0; j < upperIndex + 1; j++) {
                            lowerPoly.add(poly.get(j));
                        }
                        lowerPoly.add(p);
                        upperPoly.add(p);
                        for (int j = lowerIndex; j < i + 1; j++) {
                            upperPoly.add(poly.get(j));
                        }
                    }
                } else {
                    // connect to the closest point within the triangle

                    if (lowerIndex > upperIndex) {
                        upperIndex += poly.size();
                    }
                    closestDist = Float.MAX_VALUE;
                    for (int j = lowerIndex; j <= upperIndex; ++j) {
                        if (Point.leftOn(poly.get(i - 1), poly.get(i), poly.get(j))
                                && Point.rightOn(poly.get(i + 1), poly.get(i), poly.get(j))) {
                            d = Point.sqdist(poly.get(i), poly.get(j));
                            if (d < closestDist) {
                                closestDist = d;
                                closestVert = poly.get(j);
                                closestIndex = j % poly.size();
                            }
                        }
                    }
                    if (i < closestIndex) {
                        for (int j = i; j < closestIndex + 1; j++) {
                            lowerPoly.add(poly.get(j));
                        }

                        if (closestIndex != 0) {
                            for (int j = closestIndex; j < poly.size(); j++) {
                                upperPoly.add(poly.get(j));
                            }
                        }
                        for (int j = 0; j < i + 1; j++) {
                            upperPoly.add(poly.get(j));
                        }
                    } else {
                        if (i != 0) {
                            for (int j = i; j < poly.size(); j++) {
                                lowerPoly.add(poly.get(j));
                            }
                        }
                        for (int j = 0; j < closestIndex + 1; j++) {
                            lowerPoly.add(poly.get(j));
                        }
                        for (int j = closestIndex; j < i + 1; j++) {
                            upperPoly.add(poly.get(j));
                        }
                    }
                }
                // solve smallest poly first
                if (lowerPoly.size() < upperPoly.size()) {
                    decomposePoly(lowerPoly);
                    decomposePoly(upperPoly);
                } else {
                    decomposePoly(upperPoly);
                    decomposePoly(lowerPoly);
                }
                return;
            }
        }
        polys.add(poly);
    }


    public void triangulatePoly(Vector<Polygon> polys) {
        for (int i = 0; i < polys.size(); i++) {
            Polygon poly = polys.get(i);
            // return if poly is a triangle
            if (poly.size() == 3) {
                tris.add(poly);
                polys.remove(i);
            }
            else {
                // split poly into new triangle and poly
                Polygon tri = new Polygon();
                for (int j = 0; j < 3; j++) {
                    tri.add(poly.get(j));
                }
                Polygon newPoly = new Polygon();
                newPoly.add(poly.get(0));
                for (int k = 2; k < poly.size(); k++) {
                    newPoly.add(poly.get(k));
                }
                polys.set(i, newPoly);
                tris.add(tri);
            }
        }
        if (polys.size() != 0) {
            triangulatePoly(polys);
        }
    }

    private void loop() {
        GL.createCapabilities();

        // Set the clear color
        glClearColor(0.0f, 0.0f, 0.0f, 0.0f);

        while (!glfwWindowShouldClose(window)) {
            glClear(GL_COLOR_BUFFER_BIT); // clear the framebuffer
            System.out.println(tris.size());
            if (!polyComplete) {
                GL11.glBegin(GL_LINE_STRIP);
                for (int i = 0; i < incPoly.size(); ++i) {
                    Point p_ndc = toNDC(incPoly.get(i));
                    GL11.glVertex2f(p_ndc.x, p_ndc.y);
                }
                GL11.glEnd();
            } else {
                // polygon outlines (thin)
                for (int i = 0; i < tris.size(); ++i) {
                    GL11.glBegin(GL_LINE_LOOP);
                    for (int j = 0; j < tris.get(i).size(); ++j) {
                        Point p_ndc = toNDC(tris.get(i).get(j));
                        GL11.glVertex2f(p_ndc.x, p_ndc.y);
                    }
                    GL11.glEnd();
                }

                GL11.glBegin(GL_LINE_LOOP);
                for (int i = 0; i < incPoly.size(); ++i) {
                    Point p_ndc = toNDC(incPoly.get(i));
                    GL11.glVertex2f(p_ndc.x, p_ndc.y);
                }
                GL11.glEnd();
            }

            glfwSwapBuffers(window); // swap the color buffers

            // Poll for window events. The key callback above will only be
            // invoked during this call.
            glfwPollEvents();
        }
    }

    public static void main(String[] args) {
        new DecomposePolyExample().run();
    }
}

