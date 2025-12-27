echo ""
outputdir="/home/user/output"

for pdf in /home/user/input/*.pdf; do
    filename="$(basename -- $pdf)"
    action="pdfinfo"
    type=".txt"

    echo "#### Analyzing ${action}: ${filename} ####"
    pdfinfo $pdf > ${outputdir}/SAT_${action}_${filename}${type}
    cat ${outputdir}/SAT_${action}_${filename}${type}


done
echo ""
echo 'root@:~#'

