import pythreejs as three
import numpy as np

# Create the apple shape
phi = np.linspace(0, np.pi, 16)
theta = np.linspace(0, 2 * np.pi, 32)
phi, theta = np.meshgrid(phi, theta)
r = 1  # radius of the apple
x = r * np.sin(phi) * np.cos(theta)
y = r * np.sin(phi) * np.sin(theta)
z = r * np.cos(phi)

# Flatten arrays
x = x.flatten()
y = y.flatten()
z = z.flatten()

# Create the geometry
apple_geometry = three.Geometry(
    attributes={
        'position': three.BufferAttribute(np.array([x, y, z]).T.flatten(), normalized=False),
        'index': three.BufferAttribute(np.arange(len(x)), normalized=False)
    }
)

# Create the material
apple_material = three.MeshBasicMaterial(color='red')

# Create the mesh
apple_mesh = three.Mesh(geometry=apple_geometry, material=apple_material)

# Create the scene
scene = three.Scene(children=[apple_mesh, three.AmbientLight()])

# Set up the renderer
renderer = three.Renderer(camera=three.PerspectiveCamera(position=[0, 5, 5], fov=50), scene=scene, controls=[three.OrbitControls()])

# Export to GLTF
import pythreejs_gltf
pythreejs_gltf.save(apple_mesh, 'apple_model.glb')