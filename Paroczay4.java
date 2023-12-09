public class Paroczay4 {

	public static void main(String[] args) {
		int elso = 2, masodik = 3, kovi;
		int szamlalo = elso + masodik;
		System.out.printf("%d %d ", elso, masodik);
		for (int i = 2; i < 99; i++) {
			kovi = (masodik + 1) / elso;
			System.out.printf("%d ", kovi);
			szamlalo += kovi;
			elso = masodik;
			masodik = kovi;
		}
		System.out.printf("%nÖsszeg: %d%n", szamlalo);
	}

}