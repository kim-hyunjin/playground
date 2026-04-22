import numpy as np
import matplotlib.pyplot as plt

def step_function(x):
    y = x > 0
    return y.astype(np.int)
    
def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def relu(x):
    return np.maximum(0, x)

x = np.arange(-5.0, 5.0, 0.1)
# y = step_function(x)
# y = sigmoid(x)
y = relu(x)
        
plt.plot(x, y)
plt.ylim(-1, 5)
plt.show()
