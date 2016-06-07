test = [
    [0, 1, 2, 3, 4],
    [0, 1, 2, 3, 4],
    [0, 1, 2, 3, 4],
    [0, 1, 2, 3, 4],
    [0, 1, 2, 3, 4],
    [0, 1, 2, 3, 4]
]
print test
for col in range(0, len(test)):
    print test[col]
    for row in range(0, len(test[col])):
        print "row:", row, " col:", col