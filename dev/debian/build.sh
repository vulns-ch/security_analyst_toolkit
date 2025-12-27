docker buildx build --platform linux/i386 -t sat_debian .
docker rm sat_debian
docker create --name sat_debian sat_debian
rm -rf ext2
rm *.ext2
rm -rf split
mkdir ext2
mkdir split
docker cp sat_debian:/ ext2/
/sbin/mkfs.ext2 -b 4096 -d ext2/ debian.ext2 150M
split debian.ext2 split/debian.c -a 6 -b 128k -x --additional-suffix=.txt
stat -c%s debian.ext2 > split/debian.meta
index_list="split/index.list";
rm -f "$index_list";
ls split | tee "$index_list" > /dev/null;
chmod +rw "$index_list";
echo "created $index_list";
rm -rf ../../docs/disk-images/debian
cp -r split ../../docs/disk-images/debian
cp -r debian.ext2 ../../docs/disk-images/


