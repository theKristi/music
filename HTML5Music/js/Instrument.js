/************This is just a factory for the instruments. As Instruments get added this function will likely get updated.************/

function buildInstrument(name)
{
	if (name=='Piano')
		return new Piano();

}