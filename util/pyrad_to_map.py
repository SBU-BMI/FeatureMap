#!/usr/bin/env python

import json
import os

import numpy as np
import pandas as pd


def create_csv(input, output):
    df = pd.read_csv(input)

    imw = df['image_width'].iloc[0]
    imh = df['image_height'].iloc[0]
    pw = df['patch_width'].iloc[0]
    ph = df['patch_height'].iloc[0]

    obj = {"img_width": str(imw),
           "img_height": str(imh),
           "patch_w": str(pw),
           "patch_h": str(ph),
           "png_w": str(np.ceil(imw / pw).astype(int)),
           "png_h": str(np.ceil(imh / ph).astype(int))}

    # print(obj)
    
    cols = list(df.columns)
    
    red = 'nuclei_ratio'
    r_name  = 'Nuclear Ratio'
    green = ''
    g_name = 'Cancer'
    blue = ''
    b_name = 'Tissue'

    with open(output, 'w') as f:
        f.write(json.dumps(obj) + '\n')
        f.write('i,j,' + r_name + ',' + g_name + ',Tissue\n')
    
    modified = df[cols[5:7] + cols[11:12]]
    modified = modified.sort_values(['patch_x', 'patch_y'], ascending=[1, 1])
    modified['i'] = modified['patch_x'] / df['patch_width']
    modified['j'] = modified['patch_y'] / df['patch_height']
    modified['n'] = modified[red] * 255

    modified.i = np.ceil(modified.i).astype(int)
    modified.j = np.ceil(modified.j).astype(int)
    modified.n = np.ceil(modified.n).astype(int)

    modified.drop(red, axis=1, inplace=True)
    modified = modified.rename(index=str, columns={"n": r_name})

    cols = list(modified.columns)
    modified = modified[cols[2:]]
    modified[g_name] = 0
    modified[b_name] = 0
    modified.loc[modified[r_name] > 0, [b_name]] = ['255']

    # print(modified)

    # modified.to_csv(output, index=False)
    with open(output, 'a') as f:
        modified.to_csv(f, mode='a', header=False, index=False)


cwd = os.getcwd()
for filename in os.listdir(cwd):
    if filename.endswith(".csv"):
        create_csv(os.path.join(cwd, filename), filename + '.1')
