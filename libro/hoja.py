import sys, pypdfium2 as p
from PIL import Image
pdf=sys.argv[1]; pages=[int(x)-1 for x in sys.argv[2].split(',')]; out=sys.argv[3]; cols=int(sys.argv[4]) if len(sys.argv)>4 else 3
d=p.PdfDocument(pdf)
ims=[d[i].render(scale=1.1).to_pil() for i in pages]
w,h=ims[0].size; rows=(len(ims)+cols-1)//cols
c=Image.new('RGB',(w*cols+10*(cols-1),h*rows+10*(rows-1)),'#888')
for k,im in enumerate(ims): c.paste(im,((k%cols)*(w+10),(k//cols)*(h+10)))
c.save(out)
