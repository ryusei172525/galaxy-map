import numpy as np
from OCC.Core.BRepPrimAPI import BRepPrimAPI_MakeRevol
from OCC.Core.Geom import Geom_BezierCurve
from OCC.Core.gp import gp_Pnt
from OCC.Core.BRep import BRep_Tool
from OCC.Core.BRepMesh import BRepMesh_IncrementalMesh
from OCC.Core.StlAPI import StlAPI_Writer
from OCC.Display.SimpleGui import init_display
from pygltflib import GLTF2, Scene, Node, Mesh, Primitive, Buffer, BufferView, Accessor, Asset, save_gltf

# 3Dディスプレイ初期化
display, start_display, add_menu, add_function_to_menu = init_display()

# ベジェ曲線を使用してリンゴの回転面を作成
points = [
    gp_Pnt(0, 0, 0),
    gp_Pnt(1, -0.5, 0),
    gp_Pnt(0.8, -1.5, 0),
    gp_Pnt(0, -2, 0),
    gp_Pnt(-0.8, -1.5, 0),
    gp_Pnt(-1, -0.5, 0),
    gp_Pnt(0, 0, 0)
]
curve = Geom_BezierCurve(points)
revol = BRepPrimAPI_MakeRevol(curve, gp_Pnt(0, 0, 0), gp_Pnt(0, 0, 1)).Shape()

# メッシュ化
BRepMesh_IncrementalMesh(revol, 0.01)

# 表示
display.DisplayShape(revol, update=True)
start_display()

# STLファイルにエクスポート（中間ステップ）
stl_writer = StlAPI_Writer()
stl_writer.Write(revol, "apple.stl")

# STLファイルをGLTFファイルに変換
# ここでpygltflibを使用してGLTF形式に変換する処理を追加します

# モデルデータの作成
buffer = Buffer(uri="data:,")
buffer_view = BufferView(buffer=0, byteOffset=0, byteLength=0) # サイズは後で設定
accessor = Accessor(bufferView=0, byteOffset=0, componentType=5126, count=0, type="VEC3") # サイズとデータは後で設定
mesh = Mesh(primitives=[Primitive(attributes={"POSITION": 0}, indices=0, material=0)])
node = Node(mesh=0)
scene = Scene(nodes=[0])

gltf = GLTF2(
    scenes=[scene],
    nodes=[node],
    meshes=[mesh],
    accessors=[accessor],
    bufferViews=[buffer_view],
    buffers=[buffer],
    asset=Asset(version="2.0")
)

# GLTFファイルを保存
save_gltf(gltf, "apple.gltf")

