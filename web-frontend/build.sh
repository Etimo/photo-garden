function doit {
parcel build $1
sleep $2
doit $1 $2
}
doit $1 $2
