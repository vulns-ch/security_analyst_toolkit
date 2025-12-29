echo ""
outputdir="/home/user/output"

for pdf in /home/user/input/*.pdf; do
    filename="$(basename -- $pdf)"
    type=".png"

    action="preview"
    echo "#### Generating ${action}: ${filename} ####"
    echo "it's slow, be patient. loading..."
    pdftoppm -png $pdf "${outputdir}/SAT_preview_${filename}"
    echo "saving preview as png to ${outputdir}/SAT_preview_${filename}-xxx.png"

done
echo ""
echo 'root@:~#'

