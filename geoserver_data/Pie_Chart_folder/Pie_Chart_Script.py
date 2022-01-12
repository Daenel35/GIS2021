#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Dec 12 16:04:34 2021

@author: alessandroaustoni
"""

import matplotlib.pyplot as plt
import pandas as pd

pop_count=pd.read_csv(r'/path_to_github_repo/GIS2021/geoserver_data/pop_count_class_1K.csv',delimiter=';',decimal=',')
print(pop_count)
print(pop_count['zone'])
print(pop_count['sum'])
y=pop_count['sum']
zone=pop_count['zone']
ex=(0.5,0,0.3,0.4)
plt.figure(facecolor='w')
plt.pie(y,explode=ex,shadow=True, textprops={'color':"black"})
sizes=[90.6,6.8,1.6,0.9]			#after sending the code with autopct put here the sizes in % of the quantities
labels= [l+' '+str(s)+'%' for l,s in zip(zone,sizes)]
plt.legend(bbox_to_anchor=(0.85, 1), loc='upper right', labels=labels)

