from PIL import Image
from resizeimage import resizeimage

NUM_IMGS = 7
pic_name = 'plane'
for num in range (1,NUM_IMGS+1):
    with open('D:/Dropbox/School/more adjs/experiment 1b/Trib2011-realpics/final-images/'+ pic_name + '.png', 'rb') as fd_img:
        img = Image.open(fd_img)
        img = resizeimage.resize_width(img, 38*num)
        img.save('D:/Dropbox/School/more adjs/experiment 1b/Trib2011-realpics/final-images/' + pic_name + '_' + str(num) + '.png', img.format)