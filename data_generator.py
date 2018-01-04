#!/usr/bin/env python3
from pathlib import Path
from pprint import pprint
import json

path="./"
dirs = [str(item) for item in Path(path).iterdir() if item.is_dir()]

data={"Skins":{},"Tanks":[]}
data_full={"Tanks":{}}

for d in dirs:
    if ".git" not in d: 
        tank_name=d.replace(".sc2_textures","").replace(".sc2_meshes","").replace("_"," ")
        tank_name_long=d.replace(".sc2_textures","").replace(".sc2_meshes","")
        if tank_name not in data["Tanks"]:
            data["Tanks"].append(tank_name)
        if tank_name not in data["Skins"]:
            data["Skins"][tank_name]=[]

        if tank_name not in data_full["Tanks"]:
            data_full["Tanks"][tank_name]={"head":{"mesh":[],"textures":{}},"tracks":{"mesh":[],"textures":{}}}
        if "texture" in d:
            data_full["Tanks"][tank_name]["path_textures"]=d + "/"
        elif "mesh" in d:
            data_full["Tanks"][tank_name]["path_meshes"]=d + "/"


        files = [item.name for item in Path(d).iterdir() if item.is_file()]
        for f in files:
            if "textures" in d:
                if "track" not in f.lower():
                    if tank_name_long==f.replace(".mali.png","").replace(".png",""):
                        skin_name="Default"
                    else:
                        skin_name=f.replace(".mali.png","").replace(".png","").replace("_"," ")
                    data["Skins"][tank_name].append(skin_name)
                    
                    data_full["Tanks"][tank_name]["head"]["textures"][skin_name]={"file":f,"params":""}
                elif "track" in f.lower():
                    #data_full["Tanks"][tank_name]["tracks"]["textures"]["default"]={"file":f,"params":""}
                    data_full["Tanks"][tank_name]["tracks"]["textures"]["default"]=f;

            elif "meshes" in d:
                if "track" not in f.lower():
                    data_full["Tanks"][tank_name]["head"]["mesh"].append(f)
                elif "track" in f.lower():
                    if "crash" not in f.lower():
                        data_full["Tanks"][tank_name]["tracks"]["mesh"].append(f)

                    
print("var data=`{}`".format(json.dumps(data, indent=4, sort_keys=True)))
print("\n\n")
print("var data_full=`{}`".format(json.dumps(data_full, indent=4, sort_keys=True)))

#files = [str(item) for item in Path(path).iterdir() if item.is_file()]
