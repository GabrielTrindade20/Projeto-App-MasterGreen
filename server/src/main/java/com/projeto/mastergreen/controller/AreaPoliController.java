package com.projeto.descoberto.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projeto.descoberto.model.AreaPoli;
import com.projeto.descoberto.model.Periodo;
import com.projeto.descoberto.service.ServiceAreaPoli;

@RestController
@RequestMapping("/api/areapoli")
public class AreaPoliController {
	private final ServiceAreaPoli areaPoliService;

	@Autowired
    private ServiceAreaPoli ServiceAreaPoli;
	
	@PostMapping
    public AreaPoli createAreaPoli(@RequestBody AreaPoli areaPoli) {
        return ServiceAreaPoli.createAreaPoli(areaPoli);
    }
	
	@Autowired
	public AreaPoliController(ServiceAreaPoli areaPoliService) {
		this.areaPoliService = areaPoliService;
	}


	@GetMapping
	public List<AreaPoli> getAllAreaPolis() {
		return areaPoliService.getAllAreaPolis();
	}

	@GetMapping("/{id}")
	public AreaPoli getAreaPoliById(@PathVariable Long id) {
		return areaPoliService.getAreaPoliById(id);
	}

	@DeleteMapping("/{id}")
	public void deleteAreaPoli(@PathVariable Long id) {
		areaPoliService.deleteAreaPoli(id);
	}

}
