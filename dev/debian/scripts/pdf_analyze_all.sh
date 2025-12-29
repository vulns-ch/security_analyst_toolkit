echo ""
outputdir="/home/user/output"

for pdf in /home/user/input/*.pdf; do
    filename="$(basename -- $pdf)"
    type=".txt"

    action="pdfinfo"
    echo "#### Analyzing ${action}: ${filename} ####"
    pdfinfo $pdf > ${outputdir}/SAT_${action}_${filename}${type}
    cat ${outputdir}/SAT_${action}_${filename}${type}

    action="pdftotext"
    echo "#### Extracting Text (${action}): ${filename} ####"
    pdftotext $pdf - > ${outputdir}/SAT_${action}_${filename}${type}
    echo "saving text to ${outputdir}/SAT_${action}_${filename}${type}"
#    cat ${outputdir}/SAT_${action}_${filename}${type}

    action="pdfimages"
    echo "#### Extracting images (${action}): ${filename} ####"
    pdfimages $pdf -j ${outputdir}
    echo "saving images (if any) to ${outputdir}/SAT_${action}_${filename}${type}"



done
echo ""
echo 'root@:~#'

