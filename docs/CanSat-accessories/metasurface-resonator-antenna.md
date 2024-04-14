---
sidebar_position: 2
---

# Metasurface Resonator Antenna

CanSat NeXT Metasurface Resonator Antenna is an external antenna module, which can be used on the groundstation end to increase the communication range, and also make the communication more reliable.

![CanSat NeXT Metasurface Resonator Antenna](./img/resonator_antenna.png)

The [kit antenna](./../CanSat-hardware/communication.md#building-a-quarter-wave-monopole-antenna) of CanSat NeXT has been used to successfully operate CanSat missions where the CanSat was launched to an altitude of 1 kilometer. However, at these distances the monopole antenna starts to be at the edge of the operational range and also might lose the signal sometimes due to polarization errors arising from the linear polarization of the monopole antenna. The metasurface resonator antenna kit is designed to allow more reliable operation in this sort of extreme conditions, and also allow operation with significantly longer ranges.

The metasurface resonator antenna consists of two boards. The main antenna is on the radiator board, where a slot type antenna has been etched into the PCB. This board by itself provides roughly 3 dBi of gain, and features [circular polarization](https://en.wikipedia.org/wiki/Circular_polarization), which in practice means that the signal strength is not anymore dependant of the orientation of the satellite antenna. This board can therefore be used as an antenna itself, if a wider *beam width* is desirable.

The other board, where the antenna gets is name, is the special feature of this antenna kit. It should be placed 10-15 mm from the first board, and it features an array of resonator elements. The elements are energized by the slot antenna beneath them, and this in turn makes the antenna more *directive*. With this addition, the gain doubles to 6 dBi.


The image below shows the *reflection coefficient* of the antenna measured with a vector network analyzer (VNA). The plot shows the frequencies at which the antenna is able to transmit energy. While the antenna has quite good wideband performance, the plot shows a good impedance match at the operational frequency range of 2400-2490 MHz. This means that at these frequencies, most of the power is transmitted as radio waves as opposed to being reflected back. The lowest reflection values at the center of the band are around -18.2 dB, which means that only 1.51 % of the power was reflected back from the antenna. While more difficul to measure, simulations suggest that additional 3 % of the transmission power is converted to heat in the antenna itself, but the other 95.5 % - the radiation efficiency of the antenna - is radiated as electromagnetic radiation.

![CanSat NeXT Metasurface Resonator Antenna](./img/antenna_s11.png)

Like mentioned before, the gain of the antenna is around 6 dBi. This can be further increased with the use of a *reflector* behind the antenna, which reflects the radio waves back into the antenna, improving the directivity. While a parabolic disk would make an ideal reflector, even just a flat metal plane can be very helpful in increasing the antenna performance. According to simulations and field tests, a metal plane - such as a piece of steel sheet - placed 50-60 mm behind the antenna increases the gain to roughly 10 dBi. The metal plane should be at least 200 x 200 mm in size - larger planes should be better, but only marginally. However, it shouldn't be much smaller than this. The plane would ideally be solid metal, such as a steel sheet, but even a wire mesh will work, as long as the holes are less than 1/10 wavelength (~1.2 cm) in size. 