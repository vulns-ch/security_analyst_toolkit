docker buildx build --platform linux/i386 -t sat_debian .
docker rm sat_debian
docker create --name sat_debian sat_debian
rm -rf ext2
rm -rf ext2_scripts
rm *.ext2
rm -rf split
mkdir ext2
mkdir ext2_scripts
mkdir split
fallocate -l 400M debian.ext2
/sbin/mkfs.ext2 -E revision=0 debian.ext2
sudo mount -o loop -t ext2 debian.ext2 ./ext2


sudo docker cp sat_debian:/ ext2/
sudo umount ./ext2
du -sh ext2

#/sbin/mkfs.ext2 -E revision=0 -d ext2/ debian.ext2 2000M
#/sbin/mkfs.ext2 -b 4096 -d ext2/ debian.ext2 2000M
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
cp -r scripts/* ext2_scripts
/sbin/mkfs.ext2 -b 4096 -d ext2_scripts/ scripts.ext2 5M
cp scripts.ext2 ../../docs/disk-images/
